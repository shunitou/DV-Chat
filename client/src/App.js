
import './App.css';
import './normal.css';
import { useState, useEffect } from 'react';

function App() {

  useEffect(() => {
    getEngines();
  }, [])

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setcurrentModel] = useState("text-davinci-003");
  const [chatLog, setChatLog] = useState([{
}]);

function getEngines(){
  fetch("https://192.168.169.3:3090/models")
  .then(response => response.json())
  .then(data => {console.log(data.models.data); 
  setModels(data.models.data);
});
}

function clearChat() {
  setChatLog([]);
}


async function handleSubmit(e){
  e.preventDefault();
  let chatLogNew = [...chatLog, { user: "me", message: `${input}`}]
  await setInput("");
  setChatLog(chatLogNew)

  const messages = chatLogNew.map((message) => message.message).join("\n");
const response = await fetch("https://192.168.169.3:3090/", {
  method: "POST",
  headers: {"Content-Type": "application/json"}, 
  body: JSON.stringify({
    message: messages,
    currentModel: currentModel
  })
});
const data = await response.json();
await setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}`}])
console.log(data.message);

}


  return (
    <div className="container">
      <aside className="sidebar">
        <div className="side-menu-button" onClick={clearChat}> 
            <span>+</span>
          New Chat
        </div>
        <div className="models">
  <select onChange={(e) => {
    setcurrentModel(e.target.value)
  }}>
    {models && models.length > 0 && models.map((model) => (
      <option key={model.id} value={model.id}>{model.name}</option>
    ))}
  </select>
</div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
       {chatLog.map((message, index)=>(
        <ChatMessage key={index} message={message} />
       ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
          <input rows="1" 
          value={input} 
          onChange={(e)=> setInput(e.target.value)} 
          className="chat-input-textarea">
          </input>
          </form>
          </div>
      </section>
    </div>
  );

}

const ChatMessage = ({ message }) =>{
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
          {message.user === "gpt" && <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 3240 3240">
    <defs>
      <style>{".cls-1{fill:#070707}"}</style>
    </defs>
    <circle className="cls-1" cx={1620} cy={2117.07} r={96.99} />
    <path
      className="cls-1"
      d="M634.44 1646.2h426.99c3.05 0 5.97-1.07 8.28-3.07 25.65-22.17 186.09-157.03 292.16-157.03 115.57 0 186.78 60.4 258 60.4s113.54-61.28 245.48-61.28c120.4 0 267.31 134.04 292.1 157.49a12.69 12.69 0 0 0 8.74 3.48h439.37c11.54 0 17.15-14.1 8.71-21.98-48.8-45.55-162.7-155.58-251.51-269.91-116.23-149.63-219.32-328.37-417.01-328.37s-254.67 114.65-325.88 114.65-185.15-114.65-309.77-114.65-290.73 106.82-424.87 310.13c-100.72 135.38-211.6 243.59-259.48 288.13-8.46 7.87-2.86 22 8.69 22ZM799.4 1832.69c0 60.09-40.61 95.76-100.15 95.76-28.81 0-48.02-.83-76.28-2.2v-186.57c28.26-1.09 44.73-2.19 72.44-2.19 63.38 0 103.99 35.39 103.99 95.21Zm-56.8 0c0-28.81-17.56-46.92-43.35-46.92-6.86 0-13.99.27-20.85.55v93.56c7.4 0 15.09.27 22.49.27 24.15 0 41.71-18.1 41.71-47.46ZM978.17 1810.46v44.45h-76.55v24.97h89.44v46.37H846.19v-186.57h144.87v46.37h-89.44v24.42h76.55ZM1215.4 1926.25h-49.12l-76.27-94.11v94.11h-55.43v-186.57h50.76l74.63 94.39v-94.39h55.43v186.57ZM1362.91 1926.25h-55.15v-138.56h-59.26v-48.02h173.67v48.02h-59.27v138.56ZM1479.15 1926.25h-58.44l80.94-187.67h51.31l80.94 187.67h-58.44l-9.88-25.52h-76.55l-9.88 25.52Zm26.89-70.79h42.26l-20.86-55.15-21.4 55.15ZM1695.58 1926.25l-78.75-186.57h61.74l45 114.41 45.54-114.41h61.46l-78.47 186.57h-56.52ZM1996.74 1810.46v44.45h-76.55v24.97h89.44v46.37h-144.87v-186.57h144.87v46.37h-89.44v24.42h76.55ZM2124.5 1877.69h-15.91v48.56h-55.43v-186.57c25.24-.82 52.68-1.92 79.3-1.92 51.03 0 81.49 23.88 81.49 68.32 0 24.97-10.43 44.73-28.54 57.07l41.16 63.11h-64.48L2133 1877.7h-8.5Zm5.49-44.73c17.83 0 28.26-10.15 28.26-25.24 0-16.46-10.43-23.6-29.09-23.6h-20.57v48.84h21.4ZM2410.81 1795.92c-29.08-8.5-50.48-12.89-66.67-12.89-12.62 0-20.3 3.29-20.3 12.07 0 10.15 12.62 11.25 35.94 16.46 35.67 7.96 64.2 20.31 64.2 58.17s-29.9 60.64-79.29 60.64c-27.16 0-57.89-6.59-88.35-16.74l12.35-46.64c31.83 10.97 55.42 15.91 70.51 16.46 17.29.55 23.32-5.49 23.32-12.08 0-10.7-16.46-12.62-36.76-17.01-42.8-9.6-62.56-22.49-62.56-56.24 0-39.51 29.63-61.74 79.3-61.74 24.41 0 55.69 4.94 78.74 12.35l-10.43 47.19ZM2604.13 1810.46v44.45h-76.55v24.97h89.44v46.37h-144.87v-186.57h144.87v46.37h-89.44v24.42h76.55Z"
    />
  </svg>}
        </div>
        <div className="message">
          {message.message}
        </div>
      </div>
    </div>
  )
}

export default App;
