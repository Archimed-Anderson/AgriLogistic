from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from typing import List, Dict, Any
import logging

from config import settings

logger = logging.getLogger(__name__)


class OllamaLLMService:
    """Service for interacting with Ollama LLM models"""
    
    def __init__(self):
        self.llm = Ollama(
            base_url=settings.ollama_base_url,
            model=settings.llm_model,
            temperature=0.7,
        )
        
        self.vision_llm = Ollama(
            base_url=settings.ollama_base_url,
            model=settings.vision_model,
            temperature=0.7,
        )
        
        logger.info(f"Initialized Ollama LLM with model: {settings.llm_model}")
    
    async def generate(
        self,
        prompt: str,
        context: str = "",
        system_prompt: str = "",
    ) -> str:
        """
        Generate a response using the LLM
        
        Args:
            prompt: User question
            context: Retrieved context from vector DB
            system_prompt: System instructions
            
        Returns:
            Generated response
        """
        try:
            # Build full prompt
            full_prompt = self._build_prompt(prompt, context, system_prompt)
            
            # Generate response
            response = await self.llm.ainvoke(full_prompt)
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise
    
    async def generate_with_rag(
        self,
        question: str,
        retrieved_docs: List[Dict[str, Any]],
    ) -> str:
        """
        Generate response using RAG (Retrieval-Augmented Generation)
        
        Args:
            question: User question
            retrieved_docs: Documents retrieved from vector DB
            
        Returns:
            Generated response with citations
        """
        try:
            # Extract context from retrieved documents
            context = self._format_context(retrieved_docs)
            
            # System prompt for agricultural context
            system_prompt = """Tu es un expert agronome spécialisé dans l'agriculture africaine.
            Utilise le contexte fourni pour répondre aux questions de manière précise et pratique.
            Si le contexte ne contient pas l'information, dis-le clairement.
            Fournis des recommandations actionnables basées sur les meilleures pratiques agricoles."""
            
            # Generate response
            response = await self.generate(question, context, system_prompt)
            
            # Add citations
            response_with_citations = self._add_citations(response, retrieved_docs)
            
            return response_with_citations
            
        except Exception as e:
            logger.error(f"Error in RAG generation: {e}")
            raise
    
    async def analyze_image(
        self,
        image_path: str,
        prompt: str = "Décris cette image en détail",
    ) -> str:
        """
        Analyze an image using vision model (LLaVA)
        
        Args:
            image_path: Path to image file
            prompt: Question about the image
            
        Returns:
            Image analysis
        """
        try:
            # TODO: Implement image analysis with LLaVA
            # This requires multimodal support in LangChain
            logger.warning("Image analysis not yet implemented")
            return "Image analysis feature coming soon"
            
        except Exception as e:
            logger.error(f"Error analyzing image: {e}")
            raise
    
    def _build_prompt(
        self,
        question: str,
        context: str,
        system_prompt: str,
    ) -> str:
        """Build the complete prompt for the LLM"""
        
        template = """
{system_prompt}

CONTEXTE:
{context}

QUESTION:
{question}

RÉPONSE:
"""
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["system_prompt", "context", "question"]
        )
        
        return prompt.format(
            system_prompt=system_prompt,
            context=context,
            question=question
        )
    
    def _format_context(self, retrieved_docs: List[Dict[str, Any]]) -> str:
        """Format retrieved documents into context string"""
        
        context_parts = []
        for i, doc in enumerate(retrieved_docs, 1):
            content = doc.get("content", "")
            metadata = doc.get("metadata", {})
            source = metadata.get("source", "Unknown")
            
            context_parts.append(f"[Document {i} - Source: {source}]\n{content}\n")
        
        return "\n".join(context_parts)
    
    def _add_citations(
        self,
        response: str,
        retrieved_docs: List[Dict[str, Any]],
    ) -> str:
        """Add citations to the response"""
        
        citations = []
        for i, doc in enumerate(retrieved_docs, 1):
            metadata = doc.get("metadata", {})
            source = metadata.get("source", "Unknown")
            citations.append(f"[{i}] {source}")
        
        if citations:
            response += "\n\nSources:\n" + "\n".join(citations)
        
        return response
    
    async def check_health(self) -> bool:
        """Check if Ollama service is healthy"""
        try:
            # Simple test generation
            response = await self.llm.ainvoke("Test")
            return True
        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            return False
