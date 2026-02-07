from fastapi import FastAPI, Request, Form
from twilio.twiml.messaging_response import MessagingResponse
from agent import app_agent
import uvicorn

app = FastAPI(title="Agri-Insurance WhatsApp Webhook")

# In-memory store for user states (use Redis in production)
USER_STATES = {}

@app.post("/whatsapp/webhook")
async def whatsapp_webhook(From: str = Form(...), Body: str = Form(...)):
    """
    Webhook reached by Twilio when a message is sent to the WhatsApp Number.
    """
    user_id = From
    user_msg = Body

    # 1. Retrieve or initialize state
    if user_id not in USER_STATES:
        USER_STATES[user_id] = {
            "user_id": user_id,
            "conversation_history": [],
            "current_step": "start",
            "insurance_data": {},
            "last_message": ""
        }

    # 2. Update state with new message
    state = USER_STATES[user_id]
    state["last_message"] = user_msg
    state["conversation_history"].append({"role": "user", "content": user_msg})

    # 3. Run Agent Graph
    # Note: For simplicity, we run the next node based on current_step
    # In a full cyclic graph, LangGraph handles this with 'thread_id'
    output_state = app_agent.invoke(state)

    # 4. Save updated state
    USER_STATES[user_id] = output_state

    # 5. Get last assistant response
    assistant_msg = output_state["conversation_history"][-1]["content"]

    # 6. Response via Twilio
    resp = MessagingResponse()
    resp.message(assistant_msg)

    return str(resp)

@app.get("/health")
async def health():
    return {"status": "online", "service": "insurance-whatsapp"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3010)
