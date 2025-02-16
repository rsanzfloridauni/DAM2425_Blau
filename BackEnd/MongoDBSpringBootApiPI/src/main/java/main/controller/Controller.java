package main.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import main.model.Chat;
import main.model.Message;
import main.model.PasswordUpdate;
import main.model.User;
import main.repository.ChatRepository;
import main.repository.UserRepository;

@RestController
public class Controller {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ChatRepository chatRepository;

	@Autowired
	private MongoTemplate mongoTemplate;

	private static ArrayList<String> tokens = new ArrayList<>();
	
	@PutMapping("API/user/update-premium")
	public ResponseEntity<Object> updatePremium(
	        @RequestHeader(value = "Authorization", required = false) String token,
	        @RequestParam String userId,
	        @RequestParam int plan) {

	    if (token == null || token.isEmpty() || !tokens.contains(token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body("Acceso denegado: Token inválido o no proporcionado.");
	    }

	    Optional<User> optionalUser = userRepository.findById(userId);
	    if (optionalUser.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
	    }

	    User user = optionalUser.get();

	    LocalDateTime now = LocalDateTime.now();

	    LocalDateTime newExpirationDate;
	    switch (plan) {
	        case 1:
	            newExpirationDate = now.plusMonths(1); // 1 mes más
	            break;
	        case 2:
	            newExpirationDate = now.plusMonths(3); // 3 meses más
	            break;
	        case 3:
	            newExpirationDate = now.plusYears(1); // 12 meses más
	            break;
	        default:
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Plan no válido.");
	    }

	    if (user.isPremium() && user.getPremiumExpirationDate() != null && !user.getPremiumExpirationDate().isEmpty()) {
	        LocalDateTime currentExpirationDate = LocalDateTime.parse(
	                user.getPremiumExpirationDate() + "T00:00:00",
	                DateTimeFormatter.ISO_LOCAL_DATE_TIME
	        );

	        if (currentExpirationDate.isAfter(now)) {
	            switch (plan) {
	                case 1:
	                    newExpirationDate = currentExpirationDate.plusMonths(1);
	                    break;
	                case 2:
	                    newExpirationDate = currentExpirationDate.plusMonths(3);
	                    break;
	                case 3:
	                    newExpirationDate = currentExpirationDate.plusYears(1);
	                    break;
	            }
	        }
	    }

	    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    String newExpirationDateString = newExpirationDate.format(dateFormatter);

	    user.setPremium(true);
	    user.setPremiumExpirationDate(newExpirationDateString);

	    userRepository.save(user);

	    Map<String, Object> response = new HashMap<>();
	    response.put("id", user.getId());
	    response.put("premium", user.isPremium());
	    response.put("premiumExpirationDate", user.getPremiumExpirationDate());

	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("API/users/teachers")
	public ResponseEntity<Object> getTeachers(
	        @RequestHeader(value = "Authorization", required = false) String token) {

	    if (token == null || token.isEmpty() || !tokens.contains(token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body("Acceso denegado: Token inválido o no proporcionado.");
	    }

	    List<User> teachers = userRepository.findByTeacher(true);

	    System.out.println("Lista Profesores: "+teachers);
	    if (teachers.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron profesores.");
	    }

	    List<Map<String, Object>> teachersList = new ArrayList<>();
	    for (User teacher : teachers) {
	        Map<String, Object> teacherDetails = new HashMap<>();
	        teacherDetails.put("id", teacher.getId());
	        teacherDetails.put("name", teacher.getName());
	        teacherDetails.put("database_name", teacher.getDatabase_name());
	        teacherDetails.put("gender", teacher.getGender());
	        teacherDetails.put("age", teacher.getAge());
	        teacherDetails.put("programming_languages", teacher.getProgramming_languages());
	        teacherDetails.put("premium", teacher.isPremium());
	        teacherDetails.put("teacher", teacher.isTeacher());
	        teacherDetails.put("email", teacher.getEmail());
	        teacherDetails.put("image", teacher.getImage());
	        teacherDetails.put("premiumExpirationDate", teacher.getPremiumExpirationDate());

	        teachersList.add(teacherDetails);
	    }

	    return ResponseEntity.ok(teachersList);
	}
	
	@GetMapping("API/user/{userId}")
	public ResponseEntity<Object> getUserDetails(
	        @RequestHeader(value = "Authorization", required = false) String token,
	        @PathVariable String userId) {

	    if (token == null || token.isEmpty() || !tokens.contains(token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body("Acceso denegado: Token inválido o no proporcionado.");
	    }

	    Optional<User> optionalUser = userRepository.findById(userId);

	    if (optionalUser.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
	    }

	    User user = optionalUser.get();

	    Map<String, Object> userDetails = new HashMap<>();
	    userDetails.put("id", user.getId());
	    userDetails.put("name", user.getName());
	    userDetails.put("database_name", user.getDatabase_name());
	    userDetails.put("gender", user.getGender());
	    userDetails.put("age", user.getAge());
	    userDetails.put("programming_languages", user.getProgramming_languages());
	    userDetails.put("premium", user.isPremium());
	    userDetails.put("teacher", user.isTeacher());
	    userDetails.put("email", user.getEmail());
	    userDetails.put("image", user.getImage());
	    userDetails.put("premiumExpirationDate", user.getPremiumExpirationDate());

	    return ResponseEntity.ok(userDetails);
	}
	
	@GetMapping("API/chat/user-chats")
	public ResponseEntity<List<Chat>> getUserChats(
	        @RequestHeader(value = "Authorization", required = false) String token,
	        @RequestParam String userId) {

	    if (token == null || token.isEmpty() || !tokens.contains(token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	    }

	    List<Chat> chats = chatRepository.findByUser1IdOrUser2Id(userId, userId);

	    if (chats.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	    }

	    return ResponseEntity.ok(chats);
	}
	
	@PostMapping("API/chat/create")
	public ResponseEntity<String> createChat(
	        @RequestParam String user1Id,
	        @RequestParam String user2Id) {

	    Optional<Chat> existingChat = chatRepository.findByUser1IdAndUser2Id(user1Id, user2Id);
	    if (existingChat.isPresent()) {
	        return ResponseEntity.status(HttpStatus.CONFLICT).body("El chat ya existe.");
	    }

	    Chat chat = new Chat();
	    chat.setUser1Id(user1Id);
	    chat.setUser2Id(user2Id);
	    chatRepository.save(chat);

	    return ResponseEntity.status(HttpStatus.CREATED).body("Chat creado exitosamente.");
	}

	@PostMapping("API/chat/send-message")
	public ResponseEntity<String> sendMessage(
	        @RequestHeader(value = "Authorization", required = false) String token,
	        @RequestParam String chatId,
	        @RequestParam String senderId,
	        @RequestParam String content) {

	    if (token == null || token.isEmpty() || !tokens.contains(token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body("Acceso denegado: Token inválido o no proporcionado.");
	    }

	    Optional<Chat> optionalChat = chatRepository.findById(chatId);
	    if (!optionalChat.isPresent()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chat no encontrado.");
	    }

	    Chat chat = optionalChat.get();
	    Message message = new Message();
	    message.setSenderId(senderId);
	    message.setContent(content);
	    message.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

	    chat.getMessages().add(message);
	    chatRepository.save(chat);

	    return ResponseEntity.ok("Mensaje enviado.");
	}

	@GetMapping("API/chat/messages")
	public ResponseEntity<List<Message>> getMessages(
	        @RequestHeader(value = "Authorization", required = false) String token,
	        @RequestParam String chatId) {

	    if (token == null || token.isEmpty() || !tokens.contains(token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	    }

	    Optional<Chat> optionalChat = chatRepository.findById(chatId);
	    if (!optionalChat.isPresent()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	    }

	    return ResponseEntity.ok(optionalChat.get().getMessages());
	}

	@PostMapping("API/register")
	public ResponseEntity<Object> register(@RequestBody User usuario) {
		Optional<User> existingUser = userRepository.findByDatabaseName(usuario.getDatabase_name());

		if (existingUser.isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("El usuario ya existe. Intente otro usuario diferente");
		}

		userRepository.save(usuario);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@PostMapping("API/login")
	public ResponseEntity<Object> login(@RequestBody User usuario) {
		Optional<User> foundUser = userRepository.findUsuarioAndPassword(usuario.getDatabase_name(),
				usuario.getPassword());
		JSONObject response = new JSONObject();

		if (foundUser.isPresent()) {
			User user = foundUser.get();
			String token = UUID.randomUUID().toString();
			user.setToken(token);
			tokens.add(token);

			userRepository.save(user);

			response.put("token", token);
			response.put("id", user.getId());
			response.put("name", user.getName());
			response.put("database_name", user.getDatabase_name());
			response.put("gender", user.getGender());
			response.put("age", user.getAge());
			response.put("programming_languages", user.getProgramming_languages());
			response.put("premium", user.isPremium());
			response.put("teacher", user.isTeacher());
			response.put("email", user.getEmail());
			response.put("image", user.getImage());
			response.put("premiumExpirationDate", user.getPremiumExpirationDate());
			System.out.println("Token:" + token);
			return ResponseEntity.status(HttpStatus.OK).body(response.toString());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
		}
	}

	@PostMapping("API/verify-email")
	public ResponseEntity<String> verifyEmail(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		Optional<User> user = userRepository.findByEmail(email);

		if (user.isPresent()) {
			return ResponseEntity.ok("");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El correo no está registrado.");
		}
	}

	@PutMapping("API/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody PasswordUpdate request) {
		Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			Query query = new Query(Criteria.where("email").is(request.getEmail()));
			Update update = new Update().set("password", request.getNewPassword());
			mongoTemplate.updateFirst(query, update, User.class);

			return ResponseEntity.ok("Contraseña actualizada correctamente.");
		}

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
	}

	@GetMapping("API/users")
	public ResponseEntity<Object> getAllUsers(@RequestHeader(value = "Authorization", required = false) String token,
			@RequestParam(value = "userId", required = true) String userId) {

		if (token == null || token.isEmpty() || !tokens.contains(token)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Acceso denegado: Token inválido o no proporcionado.");
		}

		Optional<User> optionalCurrentUser = userRepository.findById(userId);
		if (!optionalCurrentUser.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
		}

		User currentUser = optionalCurrentUser.get();

		List<User> allUsers = userRepository.findAll();
		List<Map<String, Object>> filteredUsersList = new ArrayList<>();

		for (User user : allUsers) {
			if (user.getId().equals(userId)) {
				continue;
			}

			if (currentUser.getLiked().contains(user.getId()) || currentUser.getDisliked().contains(user.getId())
					|| currentUser.getMatched().contains(user.getId())) {
				continue;
			}

			Map<String, Object> userJson = new HashMap<>();
			userJson.put("id", user.getId());
			userJson.put("name", user.getName());
			userJson.put("database_name", user.getDatabase_name());
			userJson.put("gender", user.getGender());
			userJson.put("age", user.getAge());
			userJson.put("programming_languages", user.getProgramming_languages());
			userJson.put("premium", user.isPremium());
			userJson.put("teacher", user.isTeacher());
			userJson.put("email", user.getEmail());
			userJson.put("image", user.getImage());

			filteredUsersList.add(userJson);
		}

		return ResponseEntity.ok(filteredUsersList);
	}

	@PostMapping("API/logout")
	public ResponseEntity<String> logout(@RequestHeader(value = "Authorization", required = false) String token) {
		System.out.println("Token recibido: "+token);
		System.out.println("Lista tokens: "+tokens);
		if (token == null || token.isEmpty() || !tokens.contains(token)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autorizado o token inválido.");
		}

		tokens.remove(token);
		System.out.println("Lista tokens eliminado supuestamente: "+tokens);
		return ResponseEntity.ok("Sesión cerrada exitosamente.");
	}

	@PutMapping("API/update-user")
	public ResponseEntity<Object> updateUser(@RequestHeader(value = "Authorization", required = false) String token,
			@RequestBody User updatedUser) {

		System.out.println("Token enviado por el Front: " + token);
		System.out.println("Lista Tokens: " + tokens);

		if (token == null || token.isEmpty() || !tokens.contains(token)) {
			System.out.println("No encontrado token");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Acceso denegado: Token inválido o no proporcionado.");
		}
		System.out.println("Encontrado Token");
		Optional<User> optionalUser = userRepository.findById(updatedUser.getId());

		if (!optionalUser.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
		}

		User existingUser = optionalUser.get();

		existingUser.setName(updatedUser.getName());
		existingUser.setGender(updatedUser.getGender());
		existingUser.setAge(updatedUser.getAge());
		existingUser.setProgramming_languages(updatedUser.getProgramming_languages());
		existingUser.setEmail(updatedUser.getEmail());
		existingUser.setImage(updatedUser.getImage());

		userRepository.save(existingUser);

		System.out.println("Usuario Actualizado");

		JSONObject response = new JSONObject();
		response.put("id", existingUser.getId());
		response.put("name", existingUser.getName());
		response.put("database_name", existingUser.getDatabase_name());
		response.put("gender", existingUser.getGender());
		response.put("age", existingUser.getAge());
		response.put("programming_languages", existingUser.getProgramming_languages());
		response.put("premium", existingUser.isPremium());
		response.put("teacher", existingUser.isTeacher());
		response.put("email", existingUser.getEmail());
		response.put("image", existingUser.getImage());
		response.put("premiumExpirationDate", existingUser.getPremiumExpirationDate());

		return ResponseEntity.ok(response.toString());
	}

	@PutMapping("API/like")
	public ResponseEntity<Object> likeUser(@RequestHeader(value = "Authorization", required = false) String token,
			@RequestBody Map<String, String> request) {

		if (token == null || token.isEmpty() || !tokens.contains(token)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Acceso denegado: Token inválido o no proporcionado.");
		}

		String userId = request.get("userId");
		String targetUserId = request.get("targetUserId");

		Optional<User> optionalUser = userRepository.findById(userId);
		Optional<User> optionalTargetUser = userRepository.findById(targetUserId);

		if (!optionalUser.isPresent() || !optionalTargetUser.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Uno o ambos usuarios no existen.");
		}

		User user = optionalUser.get();
		User targetUser = optionalTargetUser.get();

		if (user.getLiked().contains(targetUserId)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya diste like a este usuario.");
		}

		user.getLiked().add(targetUserId);
		userRepository.save(user);

		if (targetUser.getLiked().contains(userId)) {
			user.getMatched().add(targetUserId);
			targetUser.getMatched().add(userId);

			userRepository.save(user);
			userRepository.save(targetUser);

			createChat(userId, targetUserId);

			return ResponseEntity.ok("¡Es un match!");
		}

		return ResponseEntity.ok("Like agregado, esperando reciprocidad.");
	}

	@PutMapping("API/dislike")
	public ResponseEntity<Object> dislikeUser(@RequestHeader(value = "Authorization", required = false) String token,
			@RequestBody Map<String, String> request) {

		if (token == null || token.isEmpty() || !tokens.contains(token)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Acceso denegado: Token inválido o no proporcionado.");
		}

		String userId = request.get("userId");
		String targetUserId = request.get("targetUserId");

		Optional<User> optionalUser = userRepository.findById(userId);
		Optional<User> optionalTargetUser = userRepository.findById(targetUserId);

		if (!optionalUser.isPresent() || !optionalTargetUser.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Uno o ambos usuarios no existen.");
		}

		User user = optionalUser.get();
		User targetUser = optionalTargetUser.get();

		if (user.getDisliked().contains(targetUserId)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya diste dislike a este usuario.");
		}

		if (user.getLiked().contains(targetUserId)) {
			user.getLiked().remove(targetUserId);
		}

		user.getDisliked().add(targetUserId);
		userRepository.save(user);

		return ResponseEntity.ok("Dislike agregado.");
	}

}
