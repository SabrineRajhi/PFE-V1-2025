package GestionCours.backend.springboot.authn;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            // Allow all origins (for development only - not recommended for production)
            .allowedOriginPatterns("*")
            // Allow all HTTP methods
            .allowedMethods("*")
            // Allow all headers
            .allowedHeaders("*")
            // Expose all headers
            .exposedHeaders("*")
            // Allow credentials (if needed)
            // Set max age
            .maxAge(3600);
    }
}