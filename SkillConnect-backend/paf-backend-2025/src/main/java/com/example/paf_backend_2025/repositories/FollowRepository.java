package com.example.paf_backend_2025.repositories;

import com.example.paf_backend_2025.models.Follow;
import com.example.paf_backend_2025.models.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends MongoRepository<Follow, String> {

    Optional<Follow> findByFollowerAndFollowing(AppUser follower, AppUser following);

    List<Follow> findByFollower(AppUser follower);

    List<Follow> findByFollowing(AppUser following);

    Long countByFollower(AppUser follower);

    Long countByFollowing(AppUser following);
}
