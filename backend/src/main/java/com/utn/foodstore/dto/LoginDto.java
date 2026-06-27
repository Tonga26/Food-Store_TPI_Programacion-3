package com.utn.foodstore.dto;
import jakarta.validation.constraints.NotBlank;

public record LoginDto(
    @NotBlank String email,
    @NotBlank String password
) {}