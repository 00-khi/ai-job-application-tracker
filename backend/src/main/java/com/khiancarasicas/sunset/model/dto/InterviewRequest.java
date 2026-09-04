package com.khiancarasicas.sunset.model.dto;

import com.khiancarasicas.sunset.model.enums.InterviewOutcome;
import com.khiancarasicas.sunset.model.enums.InterviewStatus;
import com.khiancarasicas.sunset.model.enums.InterviewType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class InterviewRequest {

    @NotNull(message = "Interview type is required")
    private InterviewType type;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String time;

    private String interviewer;

    @NotNull(message = "Status is required")
    private InterviewStatus status;

    private InterviewOutcome outcome;

    private String notes;
}
