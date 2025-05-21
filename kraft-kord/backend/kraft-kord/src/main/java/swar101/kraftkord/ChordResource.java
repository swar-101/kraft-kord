package swar101.kraftkord;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;



@Path("/api/chords")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Chord Generator", description = "Endpoints for chord progression generation and MIDI")
public class ChordResource {

    @Inject
    ChordService chordService;

    @GET
    @Operation(summary = "Health check")
    public String health() {
        return "KraftKord Backend is up!";
    }

    @POST
    @Path("/generate")
    public Response generate(GenerateRequest req) {
    String[] chords = chordService.generateProgression(req.style, req.bars);
    return Response.ok(new GenerateResponse(chords)).build();
    }

    @GET
    @Path("/midi/{id}")
    @Operation(summary = "Retrieve generated MIDI file by ID")
    public Response downloadMidi(@PathParam("id") String id) {
        // TODO: Load MIDI from storage and return as octet-stream
        return Response.status(Response.Status.NOT_IMPLEMENTED).build();
    }
}
