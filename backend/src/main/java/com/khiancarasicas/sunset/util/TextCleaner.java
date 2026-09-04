package com.khiancarasicas.sunset.util;

import java.util.List;
import java.util.stream.Collectors;

public class TextCleaner {

    private TextCleaner() {
    }

    public static String trimAndCollapse(String input) {
        if (input == null) {
            return null;
        }
        return input.trim().replaceAll("\\s+", " ");
    }

    public static List<String> cleanTags(List<String> tags) {
        if (tags == null) {
            return null;
        }
        return tags.stream()
                .map(TextCleaner::trimAndCollapse)
                .filter(s -> s != null && !s.isEmpty())
                .collect(Collectors.toList());
    }
}
