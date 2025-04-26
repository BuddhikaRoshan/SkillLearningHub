package com.example.paf_backend_2025.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "learning_progress_updates")
public class LearningProgressUpdate {
    @Id
    private String id;
    private String content;
    private String templateType; // e.g., "completed_tutorial", "new_skill"
    private double estimatedTime;

    public double getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(double estimatedTime) {
        this.estimatedTime = estimatedTime;
    }


    public double getCompletedProgress() {
        return completedProgress;
    }

    public void setCompletedProgress(double completedProgress) {
        this.completedProgress = completedProgress;
    }

    private double completedProgress;
    private boolean deleteStatus;

    public boolean isPublic() {
        return isPublic;
    }

    public void setIsPublic(boolean Public) {
        isPublic = Public;
    }

    private boolean isPublic;
    private Date createdAt;
    private Date updatedAt;

    @DBRef
    private AppUser user;

    public LearningProgressUpdate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deleteStatus = false;
        this.completedProgress = 0.0;
        this.estimatedTime = 0.0;
        this.isPublic = true;
    }


    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }
}