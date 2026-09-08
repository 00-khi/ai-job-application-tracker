package com.khiancarasicas.sunset.util;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class TextCleanerTest {

    @Test
    void trimAndCollapse_normalString_returnsTrimmed() {
        assertEquals("hello world", TextCleaner.trimAndCollapse("  hello  world  "));
    }

    @Test
    void trimAndCollapse_multipleInternalSpaces_collapsesToOne() {
        assertEquals("hello world", TextCleaner.trimAndCollapse("hello   world"));
    }

    @Test
    void trimAndCollapse_tabsAndNewlines_collapsesToSpace() {
        assertEquals("hello world", TextCleaner.trimAndCollapse("hello\t\n  world"));
    }

    @Test
    void trimAndCollapse_nullInput_returnsNull() {
        assertNull(TextCleaner.trimAndCollapse(null));
    }

    @Test
    void trimAndCollapse_emptyString_returnsEmpty() {
        assertEquals("", TextCleaner.trimAndCollapse(""));
    }

    @Test
    void trimAndCollapse_whitespaceOnly_returnsEmpty() {
        assertEquals("", TextCleaner.trimAndCollapse("   "));
    }

    @Test
    void trimAndCollapse_noWhitespace_returnsUnchanged() {
        assertEquals("hello", TextCleaner.trimAndCollapse("hello"));
    }

    @Test
    void cleanTags_normalTags_returnsTrimmedTags() {
        List<String> tags = List.of("  java  ", "spring", "  react ");
        assertEquals(List.of("java", "spring", "react"), TextCleaner.cleanTags(tags));
    }

    @Test
    void cleanTags_nullInput_returnsNull() {
        assertNull(TextCleaner.cleanTags(null));
    }

    @Test
    void cleanTags_emptyList_returnsEmptyList() {
        assertEquals(List.of(), TextCleaner.cleanTags(List.of()));
    }

    @Test
    void cleanTags_filtersEmptyAndBlankTags() {
        List<String> tags = Arrays.asList("java", "", "  ", "spring", null);
        assertEquals(List.of("java", "spring"), TextCleaner.cleanTags(tags));
    }

    @Test
    void cleanTags_allBlankTags_returnsEmptyList() {
        assertEquals(List.of(), TextCleaner.cleanTags(Arrays.asList("", "  ", null)));
    }
}
