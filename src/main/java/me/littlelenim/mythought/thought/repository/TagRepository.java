package me.littlelenim.mythought.thought.repository;

import me.littlelenim.mythought.thought.model.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Tag findByName(String name);

    @Query("select t from Tag t order by t.thoughts.size DESC")
    List<Tag> getTagsOrderedByThoughtsAmount(Pageable pageable); // może warto zwrócić Page zamiast List
}
