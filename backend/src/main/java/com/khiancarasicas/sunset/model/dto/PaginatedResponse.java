package com.khiancarasicas.sunset.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PaginatedResponse<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;

    public static <T> PaginatedResponse<T> of(
            List<T> content, int page, int size, long totalElements, int totalPages) {
        return new PaginatedResponse<>(
                content,
                page,
                size,
                totalElements,
                totalPages,
                page < totalPages - 1,
                page > 0);
    }
}
