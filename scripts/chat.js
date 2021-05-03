

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
        //save name in local storage
        
    }

    //update the room
    updateRoom(room) {
        this.room = room;
        if (this.unsub)
            this.unsub();

    }
}

