package com.example.paf_backend_2025.controllers;

import com.example.paf_backend_2025.dtos.FollowRequestDto;
import com.example.paf_backend_2025.services.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping
    public String followUser(@RequestBody FollowRequestDto dto) {
        return followService.followUser(dto.getFollowerId(), dto.getFollowingId());
    }

    @DeleteMapping
    public String unfollowUser(@RequestBody FollowRequestDto dto) {
        return followService.unfollowUser(dto.getFollowerId(), dto.getFollowingId());
    }

    @GetMapping("/count/following/{userId}")
    public long getFollowingCount(@PathVariable String userId) {
        return followService.getFollowingCount(userId);
    }

    @GetMapping("/count/followers/{userId}")
    public long getFollowerCount(@PathVariable String userId) {
        return followService.getFollowerCount(userId);
    }

    @GetMapping("/is-following")
    public boolean isFollowing(@RequestParam String followerId, @RequestParam String followingId) {
        return followService.isFollowing(followerId, followingId);
    }

}
