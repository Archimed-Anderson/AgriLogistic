from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional
import logging
import uuid

from config import settings

logger = logging.getLogger(__name__)


class VectorStoreService:
    """Service for managing Qdrant vector database"""

    def __init__(self):
        # Initialize Qdrant client
        self.client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
            api_key=settings.qdrant_api_key,
        )

        # Initialize embedding model
        self.embedding_model = SentenceTransformer(settings.embedding_model)

        # Collection name
        self.collection_name = settings.qdrant_collection

        # Initialize collection
        self._initialize_collection()

        logger.info(
            f"Initialized Vector Store with collection: {self.collection_name}"
        )

    def _initialize_collection(self):
        """Create collection if it doesn't exist"""
        try:
            # Check if collection exists
            collections = self.client.get_collections().collections
            collection_names = [col.name for col in collections]

            if self.collection_name not in collection_names:
                # Create collection
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=settings.embedding_dimension,
                        distance=Distance.COSINE,
                    ),
                )
                logger.info(f"Created collection: {self.collection_name}")
            else:
                logger.info(
                    f"Collection already exists: {self.collection_name}"
                )

        except Exception as e:
            logger.error(f"Error initializing collection: {e}")
            raise

    async def index_document(
        self,
        text: str,
        metadata: Dict[str, Any],
        doc_id: Optional[str] = None,
    ) -> str:
        """
        Index a document in the vector store

        Args:
            text: Document text content
            metadata: Document metadata (source, category, etc.)
            doc_id: Optional document ID (auto-generated if not provided)

        Returns:
            Document ID
        """
        try:
            # Generate document ID if not provided
            if doc_id is None:
                doc_id = str(uuid.uuid4())

            # Generate embedding
            embedding = self.embedding_model.encode(text).tolist()

            # Create point
            point = PointStruct(
                id=doc_id,
                vector=embedding,
                payload={
                    "content": text,
                    "metadata": metadata,
                }
            )

            # Upsert point
            self.client.upsert(
                collection_name=self.collection_name,
                points=[point],
            )

            logger.info(f"Indexed document: {doc_id}")
            return doc_id

        except Exception as e:
            logger.error(f"Error indexing document: {e}")
            raise

    async def index_documents_batch(
        self,
        documents: List[Dict[str, Any]],
    ) -> List[str]:
        """
        Index multiple documents in batch

        Args:
            documents: List of documents with 'text' and 'metadata' keys

        Returns:
            List of document IDs
        """
        try:
            points = []
            doc_ids = []

            for doc in documents:
                doc_id = doc.get("id", str(uuid.uuid4()))
                text = doc["text"]
                metadata = doc.get("metadata", {})

                # Generate embedding
                embedding = self.embedding_model.encode(text).tolist()

                # Create point
                point = PointStruct(
                    id=doc_id,
                    vector=embedding,
                    payload={
                        "content": text,
                        "metadata": metadata,
                    }
                )

                points.append(point)
                doc_ids.append(doc_id)

            # Batch upsert
            self.client.upsert(
                collection_name=self.collection_name,
                points=points,
            )

            logger.info(f"Indexed {len(doc_ids)} documents in batch")
            return doc_ids

        except Exception as e:
            logger.error(f"Error in batch indexing: {e}")
            raise

    async def search(
        self,
        query: str,
        top_k: int = None,
        filter_metadata: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search for similar documents

        Args:
            query: Search query
            top_k: Number of results to return
            filter_metadata: Optional metadata filters

        Returns:
            List of similar documents with scores
        """
        try:
            if top_k is None:
                top_k = settings.top_k_results

            # Generate query embedding
            query_embedding = self.embedding_model.encode(query).tolist()

            # Build filter if provided
            query_filter = None
            if filter_metadata:
                conditions = []
                for key, value in filter_metadata.items():
                    conditions.append(
                        FieldCondition(
                            key=f"metadata.{key}",
                            match=MatchValue(value=value),
                        )
                    )
                query_filter = Filter(must=conditions)

            # Search
            search_result = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=top_k,
                query_filter=query_filter,
                score_threshold=settings.similarity_threshold,
            )

            # Format results
            results = []
            for hit in search_result:
                results.append({
                    "id": hit.id,
                    "score": hit.score,
                    "content": hit.payload.get("content", ""),
                    "metadata": hit.payload.get("metadata", {}),
                })

            logger.info(f"Found {len(results)} similar documents")
            return results

        except Exception as e:
            logger.error(f"Error searching documents: {e}")
            raise

    async def delete_document(self, doc_id: str) -> bool:
        """Delete a document from the vector store"""
        try:
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=[doc_id],
            )
            logger.info(f"Deleted document: {doc_id}")
            return True

        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            return False

    async def get_collection_info(self) -> Dict[str, Any]:
        """Get information about the collection"""
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                "name": info.config.params.vectors.size,
                "vectors_count": info.vectors_count,
                "points_count": info.points_count,
                "status": info.status,
            }
        except Exception as e:
            logger.error(f"Error getting collection info: {e}")
            raise

    async def check_health(self) -> bool:
        """Check if Qdrant service is healthy"""
        try:
            self.client.get_collections()
            return True
        except Exception as e:
            logger.error(f"Qdrant health check failed: {e}")
            return False
