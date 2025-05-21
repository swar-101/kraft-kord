package swar101.kraftkord;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.Map;

@RegisterRestClient(baseUri = "https://api-inference.huggingface.co")
public interface HfChordClient {

    @POST
    @Path("/models/musiclang/musiclang-chord-v2-4k")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    Map<String,Object> generateChords(
        @HeaderParam("Authorization") String auth,
        Map<String,Object> payload
    );
}   

