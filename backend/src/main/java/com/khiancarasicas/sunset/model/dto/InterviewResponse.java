package com.khiancarasicas.sunset.model.dto;

import com.khiancarasicas.sunset.model.enums.InterviewOutcome;
import com.khiancarasicas.sunset.model.enums.InterviewStatus;
import com.khiancarasicas.sunset.model.enums.InterviewType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class InterviewResponse {

    private Long id;
    private InterviewType type;
    private LocalDate date;
    private String time;
    private String interviewer;
    private InterviewStatus status;
    private InterviewOutcome outcome;
    private String notes;
}
