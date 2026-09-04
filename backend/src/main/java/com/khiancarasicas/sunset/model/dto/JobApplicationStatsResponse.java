package com.khiancarasicas.sunset.model.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class JobApplicationStatsResponse {

    private long total;
    private long totalInterviews;
    private long offers;
    private long rejected;
    private Map<String, Long> byStatus;
}
