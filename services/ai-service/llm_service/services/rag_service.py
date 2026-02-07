from typing import Dict, Any, List, Optional
import logging

from services.ollama_service import OllamaLLMService
from services.vector_store_service import VectorStoreService

logger = logging.getLogger(__name__)


class RAGService:
    """
    Retrieval-Augmented Generation Service
    Combines vector search with LLM generation
    """

    def __init__(self):
        self.llm_service = OllamaLLMService()
        self.vector_store = VectorStoreService()
        logger.info("Initialized RAG Service")

    async def consult(
        self,
        question: str,
        category: Optional[str] = None,
        top_k: int = 3,
    ) -> Dict[str, Any]:
        """
        Main RAG consultation endpoint

        Args:
            question: User question
            category: Optional category filter (e.g., "maize", "irrigation")
            top_k: Number of documents to retrieve

        Returns:
            Response with answer and sources
        """
        try:
            # Step 1: Retrieve relevant documents
            filter_metadata = {"category": category} if category else None
            retrieved_docs = await self.vector_store.search(
                query=question,
                top_k=top_k,
                filter_metadata=filter_metadata,
            )

            if not retrieved_docs:
                return {
                    "answer": (
                        "Je n'ai pas trouvé d'informations pertinentes dans "
                        "ma base de connaissances pour répondre à cette "
                        "question."
                    ),
                    "sources": [],
                    "confidence": 0.0,
                }

            # Step 2: Generate response using LLM with context
            answer = await self.llm_service.generate_with_rag(
                question=question,
                retrieved_docs=retrieved_docs,
            )

            # Step 3: Calculate confidence based on retrieval scores
            avg_score = sum(
                doc["score"] for doc in retrieved_docs
            ) / len(retrieved_docs)

            # Step 4: Format sources
            sources = [
                {
                    "source": doc["metadata"].get("source", "Unknown"),
                    "relevance": doc["score"],
                    "excerpt": doc["content"][:200] + "...",
                }
                for doc in retrieved_docs
            ]

            return {
                "answer": answer,
                "sources": sources,
                "confidence": avg_score,
                "retrieved_docs_count": len(retrieved_docs),
            }

        except Exception as e:
            logger.error(f"Error in RAG consultation: {e}")
            raise

    async def index_knowledge(
        self,
        text: str,
        metadata: Dict[str, Any],
    ) -> str:
        """
        Index new knowledge into the system

        Args:
            text: Knowledge content
            metadata: Metadata (source, category, author, etc.)

        Returns:
            Document ID
        """
        try:
            doc_id = await self.vector_store.index_document(
                text=text,
                metadata=metadata,
            )
            logger.info(f"Indexed new knowledge: {doc_id}")
            return doc_id

        except Exception as e:
            logger.error(f"Error indexing knowledge: {e}")
            raise

    async def index_knowledge_batch(
        self,
        documents: List[Dict[str, Any]],
    ) -> List[str]:
        """
        Index multiple knowledge documents in batch

        Args:
            documents: List of documents with 'text' and 'metadata'

        Returns:
            List of document IDs
        """
        try:
            doc_ids = await self.vector_store.index_documents_batch(documents)
            logger.info(f"Indexed {len(doc_ids)} knowledge documents")
            return doc_ids

        except Exception as e:
            logger.error(f"Error in batch knowledge indexing: {e}")
            raise

    async def get_system_stats(self) -> Dict[str, Any]:
        """Get RAG system statistics"""
        try:
            collection_info = await self.vector_store.get_collection_info()
            ollama_healthy = await self.llm_service.check_health()
            qdrant_healthy = await self.vector_store.check_health()

            is_healthy = ollama_healthy and qdrant_healthy
            return {
                "knowledge_base": collection_info,
                "services": {
                    "ollama": "healthy" if ollama_healthy else "unhealthy",
                    "qdrant": "healthy" if qdrant_healthy else "unhealthy",
                },
                "status": "operational" if is_healthy else "degraded",
            }

        except Exception as e:
            logger.error(f"Error getting system stats: {e}")
            raise
