from typing import TypedDict, List, Dict, Any, Annotated
import operator
from langgraph.graph import StateGraph, END
import ollama
import json

# ==========================================
# 1. State Definition
# ==========================================
class AgentState(TypedDict):
    user_id: str
    last_message: str
    conversation_history: Annotated[List[Dict[str, str]], operator.add]
    current_step: str
    insurance_data: Dict[str, Any]
    next_node: str

# ==========================================
# 2. Ollama Utility
# ==========================================
def call_ollama(prompt: str, system: str = ""):
    response = ollama.generate(
        model='mistral', # Or 'gpt-oss' if configured
        system=system,
        prompt=prompt,
        stream=False
    )
    return response['response']

# ==========================================
# 3. Graph Nodes
# ==========================================

def node_greet(state: AgentState):
    msg = state['last_message']
    prompt = f"L'utilisateur dit: '{msg}'. Salue-le poliment au nom d'Agri-Insurance et demande-lui s'il souhaite assurer sa récolte."
    response = call_ollama(prompt, system="Tu es un agent d'assurance agricole bienveillant.")
    return {
        "conversation_history": [{"role": "assistant", "content": response}],
        "next_node": "ask_crop",
        "current_step": "greeting"
    }

def node_ask_crop(state: AgentState):
    msg = state['last_message']
    # Extract crop using LLM
    extract_prompt = f"Extrais le nom de la culture de ce message: '{msg}'. Réponds juste le nom du fruit ou légume. Si absent, réponds 'NONE'."
    crop = call_ollama(extract_prompt).strip()
    
    if "NONE" in crop.upper():
        response = "Quelle culture souhaitez-vous assurer ? (Ex: Maïs, Riz, Mangues)"
        return {
            "conversation_history": [{"role": "assistant", "content": response}],
            "next_node": "ask_crop", # Loop until we get the crop
            "current_step": "getting_crop"
        }
    
    state['insurance_data']['crop'] = crop
    response = f"D'accord, nous allons assurer votre culture de {crop}. Dans quelle localité se situe votre exploitation ?"
    return {
        "insurance_data": state['insurance_data'],
        "conversation_history": [{"role": "assistant", "content": response}],
        "next_node": "ask_location",
        "current_step": "getting_location"
    }

def node_ask_location(state: AgentState):
    msg = state['last_message']
    # Extract location
    extract_prompt = f"Extrais la ville ou région de ce message: '{msg}'. Réponds juste le nom du lieu. Si absent, réponds 'NONE'."
    location = call_ollama(extract_prompt).strip()

    if "NONE" in location.upper():
        response = "Pourriez-vous me préciser la ville ou la région de votre champ ?"
        return {
            "conversation_history": [{"role": "assistant", "content": response}],
            "next_node": "ask_location",
            "current_step": "getting_location"
        }

    state['insurance_data']['location'] = location
    return {
        "insurance_data": state['insurance_data'],
        "next_node": "calculate_risk"
    }

def node_calculate_risk(state: AgentState):
    location = state['insurance_data'].get('location')
    crop = state['insurance_data'].get('crop')
    
    # In a real scenario, we'd call the Weather API here.
    # We'll mock the weather for this integration test code.
    weather_info = "Température 32°C, Risque de sécheresse modéré, Précipitations faibles prévues."
    
    prompt = (
        f"Analyse le risque pour une culture de {crop} à {location}. "
        f"Données météo: {weather_info}. "
        f"Génère une proposition de prime d'assurance (ex: 5% de la valeur) et explique pourquoi par rapport au climat."
    )
    
    response = call_ollama(prompt, system="Tu es un expert en gestion des risques agricoles.")
    
    return {
        "conversation_history": [{"role": "assistant", "content": response}],
        "next_node": "finalize_policy"
    }

def node_finalize_policy(state: AgentState):
    response = "Souhaitez-vous valider cette proposition ? Vous recevrez un lien de paiement sécurisé par SMS."
    return {
        "conversation_history": [{"role": "assistant", "content": response}],
        "next_node": END
    }

# ==========================================
# 4. Graph Construction
# ==========================================
def create_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("greet", node_greet)
    workflow.add_node("ask_crop", node_ask_crop)
    workflow.add_node("ask_location", node_ask_location)
    workflow.add_node("calculate_risk", node_calculate_risk)
    workflow.add_node("finalize_policy", node_finalize_policy)

    workflow.set_entry_point("greet")

    workflow.add_edge("greet", "ask_crop")
    workflow.add_edge("ask_crop", "ask_location")
    workflow.add_edge("ask_location", "calculate_risk")
    workflow.add_edge("calculate_risk", "finalize_policy")
    workflow.add_edge("finalize_policy", END)

    return workflow.compile()

# Initialize graph
app_agent = create_graph()
