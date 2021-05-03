//dom queries
const chatList = document.querySelector('.chat-list');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMsg = document.querySelector('.update-msg');
const chatRooms = document.querySelector('.chat-rooms');


//check local storage for a name
const username = localStorage.username ? localStorage.username : 'annonymous';

//class instances
const chatroom = new Chatroom('general', username); //default room
const chatUI = new ChatUI(chatList);



//get chats and render
chatroom.getChats(data => chatUI.render(data));


//add a new chat
newChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = newChatForm.message.value.trim();
    chatroom.addChat(message)
        .then(() => newChatForm.reset())
        .catch(err => console.log(err));
});

//update the name
newNameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //update Name via chatroom
    const newName = newNameForm.name.value.trim();
    chatroom.updateName(newName);
    //reset the form
    newNameForm.reset();
    //show and hide updated name as notification
    updateMsg.innerText = `You are Interacting as ${newName} now!`;
    setTimeout(() => updateMsg.innerText = "", 3000);


});

//update the room
chatRooms.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const room = e.target.getAttribute('id');
        //clear the existing chats 
        chatUI.clear();
        //update the room
        chatroom.updateRoom(room);
        //build the ui according to the room
        chatroom.getChats(data => chatUI.render(data));
    }
});