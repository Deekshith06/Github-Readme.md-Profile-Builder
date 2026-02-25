package com.student.readmebuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

// This is our REST controller - it handles HTTP requests from the browser
// @RestController = @Controller + @ResponseBody (auto converts return to JSON/String)
// @RequestMapping sets the base URL prefix for all methods in this class
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow calls from browser (CORS fix)
public class Controller {

    // Spring will inject the ReadmeGenerator bean automatically
    @Autowired
    private ReadmeGenerator generator;

    // POST /api/generate
    // Frontend sends form data as JSON, we return the README content
    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateReadme(@RequestBody Map<String, String> formData) {

        // Generate the README markdown string (generator reads all fields from the map)
        String readmeContent = generator.generate(formData);

        // Also save it to a file in the generated/ folder
        // This is optional but nice to have
        try {
            // Create the generated folder if it doesn't exist
            Files.createDirectories(Paths.get("generated"));
            Files.writeString(Paths.get("generated/README.md"), readmeContent);
            System.out.println("✅ README saved to generated/README.md");
        } catch (IOException e) {
            // Not a critical error, just log it and continue
            System.out.println("⚠️ Could not save file: " + e.getMessage());
        }

        // Return the content as JSON so frontend can display it
        return ResponseEntity.ok(Map.of("readme", readmeContent));
    }

    // GET /api/download
    // Returns the last generated README as a file download
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadReadme() {
        try {
            byte[] content = Files.readAllBytes(Paths.get("generated/README.md"));

            // Set headers to tell browser this is a file download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);
            headers.setContentDispositionFormData("attachment", "README.md");

            return ResponseEntity.ok().headers(headers).body(content);
        } catch (IOException e) {
            // If file doesn't exist yet, return 404
            return ResponseEntity.notFound().build();
        }
    }
}
