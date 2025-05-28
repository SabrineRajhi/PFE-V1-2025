package GestionCours.backend.springboot.Controllers;



import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Entity.ElementCours;
import GestionCours.backend.springboot.Entity.EspaceCours;
import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Exception.ElementCoursException;
import GestionCours.backend.springboot.Repositrory.ElementCoursRepository;
import GestionCours.backend.springboot.Repositrory.ElementRepository;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import GestionCours.backend.springboot.Repositrory.TypeElementRepository;
import GestionCours.backend.springboot.Services.ElementCoursServiceInterface;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/element-cours")
@CrossOrigin(origins = "http://localhost:3000")
public class ElementCoursController {

	 private static final Logger logger = LoggerFactory.getLogger(ElementCoursController.class);
	 
    @Autowired
    private ElementCoursServiceInterface elementCoursService;


    
    
    @Autowired
    private EspaceCoursRepository   EspaceCoursR;
    
    
    @Autowired
    public  ElementCoursRepository  ElementCoursR;
    
    
    @Autowired
    public  TypeElementRepository TypeElementR;
    
    @Autowired
    public  ElementRepository ElementR;

    // Récupérer tous les éléments de cours
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    
    @GetMapping("/getAllElementCours")
    public ResponseEntity<List<ElementCours>> getAllElementCours() {
        List<ElementCours> elementCoursList = elementCoursService.getAllElementCours();
        if (elementCoursList.isEmpty()) {
        	logger.info("Aucun élément de cours trouvé.");
            return ResponseEntity.noContent().build();
        }
        logger.info("Liste des éléments de cours récupérée : {} éléments", elementCoursList.size());
        return ResponseEntity.ok(elementCoursList);
    }
    
    
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @GetMapping("/getElementCours/{id}")
    public ResponseEntity<?> getElementCoursById(@PathVariable Long id) {
        try {
            ElementCours elementCours = elementCoursService.getElementCoursById(id);
            logger.info("ElementCours récupéré avec succès pour l'ID : {}", id);
            return ResponseEntity.ok(elementCours);
        } catch (ElementCoursException e) {
        	
            logger.error("Erreur lors de la récupération de l'ElementCours ID : {}", id, e);
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }


    
    
    // Ajouter  un élément de cours
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @PostMapping(value = "/addElementCours", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> ajouterElementCours(
            @RequestParam("visibleEC") boolean visibleEC,
            @RequestParam("ordreEC") int ordreEC,
            @RequestParam("dateLimite") String dateLimite,
            @RequestParam("idespac") Long idEspaceCours,
            @RequestParam("idTE") Long idTE,
            @RequestParam("chemin_elt") MultipartFile fichier,
            @RequestParam("des_elt") String description
    ) {
        try {
            if (fichier.isEmpty()) {
                return ResponseEntity.badRequest().body("Fichier manquant ou vide");
            }

            EspaceCours espaceCours = EspaceCoursR.findById(idEspaceCours)
                    .orElseThrow(() -> new RuntimeException("EspaceCours non trouvé"));
            TypeElement typeElement = TypeElementR.findById(idTE)
                    .orElseThrow(() -> new RuntimeException("TypeElement non trouvé"));

            // Crée le répertoire s'il n'existe pas
            String dossierDestination = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "elements";
            File dossier = new File(dossierDestination);
            if (!dossier.exists()) dossier.mkdirs();

            // Nom de fichier sécurisé et unique
            String nomFichier = Paths.get(fichier.getOriginalFilename()).getFileName().toString();
            String nomFichierUnique = System.currentTimeMillis() + "_" + nomFichier;
            Path cheminFichier = Paths.get(dossierDestination, nomFichierUnique);
            fichier.transferTo(cheminFichier.toFile());

            String cheminEnregistre = "uploads/elements/" + nomFichierUnique;

            Element element = new Element();
            element.setDesElt(description);
            element.setCheminElt(cheminEnregistre);
            element.setTypeElement(typeElement);
            element.setEspaceCours(espaceCours);
            element = ElementR.save(element);

            ElementCours ec = new ElementCours();
            ec.setOrdreEC(ordreEC);
            ec.setVisibleEC(visibleEC);
            ec.setDateLimite(dateLimite); // ou parser en LocalDate
            ec.setEspaceCours(espaceCours);
            ec.setElement(element);
            ElementCoursR.save(ec);

            return ResponseEntity.ok("Élément cours ajouté avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }

  
    

    

    
    // Mise a jour  un élément de cours
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @PutMapping(value = "/updateElementCours/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateElementCours(
            @PathVariable Long id,
            @RequestParam(value = "visibleEC", required = false) Boolean visibleEC,
            @RequestParam(value = "ordreEC", required = false) Integer ordreEC,
            @RequestParam(value = "dateLimite", required = false) String dateLimite,
            @RequestParam(value = "idTE", required = false) Long idTE,
            @RequestParam(value = "chemin_elt", required = false) MultipartFile fichier,
            @RequestParam(value = "des_elt", required = false) String description) {
        
        try {
            // Récupérer l'ElementCours existant
            ElementCours ec = ElementCoursR.findById(id)
                    .orElseThrow(() -> new RuntimeException("ElementCours non trouvé"));

            // Mettre à jour les champs si fournis
            if (visibleEC != null) {
                ec.setVisibleEC(visibleEC);
            }
            if (ordreEC != null) {
                ec.setOrdreEC(ordreEC);
            }
            if (dateLimite != null) {
                ec.setDateLimite(dateLimite);
            }

            // Récupérer l'Element associé
            Element element = ec.getElement();
            
            // Mettre à jour la description si fournie
            if (description != null) {
                element.setDesElt(description);
            }

            // Mettre à jour le TypeElement si fourni
            if (idTE != null) {
                TypeElement typeElement = TypeElementR.findById(idTE)
                        .orElseThrow(() -> new RuntimeException("TypeElement non trouvé"));
                element.setTypeElement(typeElement);
            }

            // Gérer le fichier uploadé si fourni
            if (fichier != null && !fichier.isEmpty()) {
                // Crée le répertoire s'il n'existe pas
                String dossierDestination = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "elements";
                File dossier = new File(dossierDestination);
                if (!dossier.exists()) dossier.mkdirs();

                // Nom de fichier sécurisé et unique
                String nomFichier = Paths.get(fichier.getOriginalFilename()).getFileName().toString();
                String nomFichierUnique = System.currentTimeMillis() + "_" + nomFichier;
                Path cheminFichier = Paths.get(dossierDestination, nomFichierUnique);
                fichier.transferTo(cheminFichier.toFile());

                String cheminEnregistre = "uploads/elements/" + nomFichierUnique;
                element.setCheminElt(cheminEnregistre);
            }

            // Sauvegarder les modifications
            ElementR.save(element);
            ElementCoursR.save(ec);

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Élément cours mis à jour avec succès",
                "id", ec.getIdEC()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "error",
                        "message", "Erreur lors de la mise à jour : " + e.getMessage()
                    ));
        }
    }

    // Supprimer un élément de cours
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @DeleteMapping("/deleteElementCours/{id}")
    public ResponseEntity<String> deleteElementCours(@PathVariable Long id) {
        try {
            elementCoursService.deleteElementCours(id);
            logger.info("ElementCours supprimé avec succès, ID : {}", id);
            return ResponseEntity.ok("Élément de cours supprimé avec succès !");
            
        } catch (ElementCoursException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }
}