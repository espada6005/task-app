package com.example.backend.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    private Upload upload = new Upload();
    private Jwt jwt = new Jwt();

    @Getter
    @Setter
    public static class Upload {
        private String dir = "./uploads";
    }

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long expirationSeconds = 3600;
    }
}
