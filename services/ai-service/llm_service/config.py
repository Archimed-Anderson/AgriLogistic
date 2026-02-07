from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Ollama Configuration
    ollama_base_url: str = "http://localhost:11434"
    llm_model: str = "glm4:9b"
    vision_model: str = "llava:13b"
    
    # Qdrant Configuration
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_collection: str = "agri_knowledge_base"
    qdrant_api_key: Optional[str] = None
    
    # Embedding Configuration
    embedding_model: str = "nomic-embed-text"
    embedding_dimension: int = 768
    
    # RAG Configuration
    top_k_results: int = 3
    similarity_threshold: float = 0.7
    max_context_length: int = 4000
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_workers: int = 4
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
