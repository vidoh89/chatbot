const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const  chatInput = document.querySelector(".chat-input");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "Past-API-Key"; //API key placeholder
const inputInintHeight = chatInput.scrollHeight;

const createChatLi = (message,className) =>{
    //Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className ==="outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">Robot_2</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelectors("p").textContent = message;
    return chatLi; // return chat <li> element
}
const generateResponse = (chatElement) =>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    //Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        header: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            message: [{role: "user",content:userMessage}],
        })
    }
    // Send POST request to API, get response and set the reponse as paragraph
    fetch(API_URL, requestOptions).then(res =>requestOptions.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(()=>{
        messageElement.classList.add('error');
        messageElement.textContent = "I do apologize,there seems to have been an error, please try again.";
    }).finally(()=> chatbox.scrollTo(0,chatbox.scrollHeight));
}
const handleChat = () => {
    userMessage = chatInput.value.trim(); //Collect user message
    if(!userMessage)return;

    //Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.getElementsByClassName.height = `${inputIniitHeight}px`;

    //Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTop(0,chatbox.scrollHeight);

    setTimeout(()=>{
        //Display message while chatbot is waiting for a response
        const incomingChatLi = createChatLi("One moment please,I just need a moment to think...","incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}
chatInput.addEventListener("input",()=>{
    // Adjust textarea parallel to content 
    chatInput.style.height = `${inputInitHeight}.px`;
    chatInput.style.height = `${chatInput.scrollHeight}.px`;
});
chatInput.addEventListener("keydown",(e)=>{
    //If the enter key is pressed without shift key
    //and window width is greater than 800px. handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleChat();
    }
});
sendChatBtn.addEventListener("click",handleChat);
closeBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));
