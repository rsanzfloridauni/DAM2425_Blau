package main.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import main.model.User;

public interface UserRepository extends MongoRepository<User, String>{

	@Query("{ 'database_name': ?0, 'password': ?1 }")
	Optional<User> findUsuarioAndPassword(String user,String pass);
	
	@Query("{ 'email': ?0}")
	Optional<User> findByEmail(String email);
	
	@Query("{ 'database_name': ?0}")
	Optional<User> findByDatabaseName(String databaseName);
	
	List<User> findByTeacher(boolean teacher);

}
