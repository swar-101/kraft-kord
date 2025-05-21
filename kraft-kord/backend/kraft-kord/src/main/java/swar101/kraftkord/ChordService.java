package swar101.kraftkord;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import java.util.Map;
import java.util.HashMap;

@ApplicationScoped
public class ChordService {

    @Inject @RestClient
    HfChordClient hfClient;

    @ConfigProperty(name = "hf.api.token")
    String hfToken;

    public String[] generateProgression(String style, int bars) {
        // Build the HF payload
        Map<String,Object> payload = new HashMap<>();
        payload.put("inputs", String.format("Generate a %s chord progression in %d bars", style, bars));
        // Call HF
        Map<String,Object> resp = hfClient.generateChords("Bearer " + hfToken, payload);
        // Extract the returned chords (model-dependent key)
        // e.g., resp.get("generated_text") or a list under resp.get("chords")
        String text = (String) resp.get("generated_text");
        return text.trim().split("\\s*-\\s*");
    }
}

