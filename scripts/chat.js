

class Chatroom {
    constructor(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }

    //adding new chat docs
    async addChat(message) {
        //create and format a chat object
        const now = new Date();

        const chat = {
            message,
            room: this.room,
            username: this.username,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };

        //save the chat object in firestore

        const response = await this.chats.add(chat);
        return response;
    }


    //setting up a real-time listener to get new docs
    getChats(callback) {
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        //update the ui
                        callback(change.doc.data());
                    }
                });
            });
    }

    //update username
    updateName(name) {
        this.username = name;
    }

    //update the room
    updateRoom(room) {
        this.room = room;
        if (this.unsub)
            this.unsub();

    }
}

const chatroom = new Chatroom('gaming', 'Nayana');

// chatroom.addChat('booya!')
//     .then(() => console.log("message sent!"))
//     .catch((err) => console.log(err));

chatroom.getChats((data) => {
    console.log(data);
})


// setTimeout(() => {
//     chatroom.updateRoom('gaming');
//     chatroom.updateName('Batman');
//     chatroom.getChats((data) => {
//         console.log(data);
//     });
//     chatroom.addChat('hello');

// }, 3000);