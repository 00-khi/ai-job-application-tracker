package com.khiancarasicas.sunset.model.dto;

import com.khiancarasicas.sunset.model.enums.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobApplicationSearchRequest {

    private int page = 0;
    private int size = 10;
    private String search;
    private ApplicationStatus status;
    private String sortBy = "createdAt";
    private String sortDirection = "desc";

    public int getSafePage() {
        return Math.max(0, page);
    }

    public int getSafeSize() {
        return Math.min(Math.max(1, size), 100);
    }
}
