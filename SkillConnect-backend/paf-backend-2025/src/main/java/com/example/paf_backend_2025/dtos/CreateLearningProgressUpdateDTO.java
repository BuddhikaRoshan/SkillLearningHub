package com.example.paf_backend_2025.dtos;

public class CreateLearningProgressUpdateDTO {
    private String content;
    private String templateType;
    private double completedProgress;
    private String userId;
    private boolean isPublic; // Add this field
    private double estimatedTime;

    public double getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(double estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public CreateLearningProgressUpdateDTO() {
        this.completedProgress = 0.0;
        this.isPublic = true; // Default to public
    }
    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
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

    public double getCompletedProgress() {
        return completedProgress;
    }

    public void setCompletedProgress(double completedProgress) {
        this.completedProgress = completedProgress;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}