package main.model;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users", value = "")
public class User {
	
	@Id
	private String _id;
	
	String name;
	
	@Indexed(unique = true)
	String database_name;
	
	String gender;
	int age;
	String programming_languages;
	boolean premium;
	boolean teacher;
	String password;
	String email;
	ArrayList<String> matched;
	ArrayList<String> liked;
	ArrayList<String> disliked;
	String image;
	String premiumExpirationDate;
	String token;
	
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	public String getId() {
		return _id;
	}
	public void setId(String _id) {
		this._id = _id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDatabase_name() {
		return database_name;
	}
	public void setDatabase_name(String database_name) {
		this.database_name = database_name;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getProgramming_languages() {
		return programming_languages;
	}
	public void setProgramming_languages(String programming_languages) {
		this.programming_languages = programming_languages;
	}
	public boolean isPremium() {
		return premium;
	}
	public void setPremium(boolean premium) {
		this.premium = premium;
	}
	public boolean isTeacher() {
		return teacher;
	}
	public void setTeacher(boolean teacher) {
		this.teacher = teacher;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public ArrayList<String> getMatched() {
		return matched;
	}
	public void setMatched(ArrayList<String> matched) {
		this.matched = matched;
	}
	public ArrayList<String> getLiked() {
		return liked;
	}
	public void setLiked(ArrayList<String> liked) {
		this.liked = liked;
	}
	public ArrayList<String> getDisliked() {
		return disliked;
	}
	public void setDisliked(ArrayList<String> disliked) {
		this.disliked = disliked;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getPremiumExpirationDate() {
		return premiumExpirationDate;
	}
	public void setPremiumExpirationDate(String premiumExpirationDate) {
		this.premiumExpirationDate = premiumExpirationDate;
	}
	public User(String name, String database_name, String gender, int age, String programming_languages,
			boolean premium, boolean teacher, String password, String email, ArrayList<String> matched,
			ArrayList<String> liked, ArrayList<String> disliked, String image, String premiumExpirationDate) {
		super();
		this.name = name;
		this.database_name = database_name;
		this.gender = gender;
		this.age = age;
		this.programming_languages = programming_languages;
		this.premium = premium;
		this.teacher = teacher;
		this.password = password;
		this.email = email;
		this.matched = matched;
		this.liked = liked;
		this.disliked = disliked;
		this.image = image;
		this.premiumExpirationDate = premiumExpirationDate;
	}
	public User() {

	}
	
	
	
	

}
