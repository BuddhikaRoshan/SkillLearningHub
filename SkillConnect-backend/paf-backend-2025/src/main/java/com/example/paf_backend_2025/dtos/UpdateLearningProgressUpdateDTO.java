package com.example.paf_backend_2025.dtos;

public class UpdateLearningProgressUpdateDTO {
    private String content;
    private String templateType;
    private double completedProgress;

    private boolean isPublic;
    private double estimatedTime;

    public double getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(double estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    // Constructors, Getters and Setters
    public UpdateLearningProgressUpdateDTO() {
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
}
