package main.repository;

import main.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findByUser1IdAndUser2Id(String user1Id, String user2Id);

    List<Chat> findByUser1IdOrUser2Id(String user1Id, String user2Id);
}