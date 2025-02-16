package main.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "chats")
public class Chat {
	@Id
	private String id;
	private String user1Id;
	private String user2Id; 
	private List<Message> messages = new ArrayList<>();


	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUser1Id() {
		return user1Id;
	}

	public void setUser1Id(String user1Id) {
		this.user1Id = user1Id;
	}

	public String getUser2Id() {
		return user2Id;
	}

	public void setUser2Id(String user2Id) {
		this.user2Id = user2Id;
	}

	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}
}