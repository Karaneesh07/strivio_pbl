package com.dailyDSA.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FocusSessionRequest {
    @NotNull
    private Integer durationMinutes;
}
