package com.khiancarasicas.sunset.model.dto;

import java.util.List;

public record JobFitResponse(
    int overallScore,
    String scoreLabel,
    int interviewProbability,
    String executiveAssessment,
    List<ScoreBreakdownItem> scoreBreakdown,
    List<StrengthItem> strongestParts,
    List<WeaknessItem> weakestParts,
    ScoredAnalysis experienceAnalysis,
    ScoredAnalysis projectAnalysis,
    ScoredAnalysis metricsImpactAnalysis,
    String careerDirection,
    List<RecommendedPosition> recommendedPositions,
    List<RedFlag> redFlags,
    AtsAnalysis atsAnalysis,
    List<SectionImprovement> sectionImprovements,
    List<BulletImprovement> bulletImprovements,
    List<ActionPlanItem> actionPlan
) {
    public record ScoreBreakdownItem(String dimension, int score, String comment) {}

    public record StrengthItem(String area, String detail, String whyItMatters) {}

    public record WeaknessItem(String area, String detail, String impact) {}

    public record ScoredAnalysis(int rating, String summary, List<String> findings) {}

    public record RecommendedPosition(String position, int fitScore, List<PositionDimension> dimensions) {}

    public record PositionDimension(String dimension, int score) {}

    public record RedFlag(String flag, String severity, String detail) {}

    public record AtsAnalysis(int score, int keywordMatchPercent, List<String> missingKeywords,
                              List<String> formatIssues, String assessment) {}

    public record SectionImprovement(String section, String issue, String recommendation, String priority) {}

    public record BulletImprovement(String original, String improved, String reason) {}

    public record ActionPlanItem(String priority, String action, String timeframe, String expectedImpact) {}
}
