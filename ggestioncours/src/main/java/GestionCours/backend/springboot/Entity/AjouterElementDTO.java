package GestionCours.backend.springboot.Entity;




import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


public class AjouterElementDTO {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	
	 private Integer ordre;
	    private String description;
	    private Boolean visible;
	    private Long typeId;
	    private String dateLimite;
	    private MultipartFile file; // Pour l'upload du fichier
	    
	    private long idespac;
	    
	    
		public AjouterElementDTO(Integer ordre, String description, Boolean visible, Long typeId, String dateLimite,
				MultipartFile file, long idespac) {
			super();
			this.ordre = ordre;
			this.description = description;
			this.visible = visible;
			this.typeId = typeId;
			this.dateLimite = dateLimite;
			this.file = file;
			this.idespac = idespac;
		}

		public AjouterElementDTO() {}

		public Integer getOrdre() {
			return ordre;
		}

		public void setOrdre(Integer ordre) {
			this.ordre = ordre;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public Boolean getVisible() {
			return visible;
		}

		public void setVisible(Boolean visible) {
			this.visible = visible;
		}

		public Long getTypeId() {
			return typeId;
		}

		public void setTypeId(Long typeId) {
			this.typeId = typeId;
		}

		public String getDateLimite() { return dateLimite; }
	    public void setDateLimite(String dateLimite) { this.dateLimite = dateLimite; }

		public MultipartFile getFile() {
			return file;
		}

		public void setFile(MultipartFile file) {
			this.file = file;
		}

		public long getIdespac() {
			return idespac;
		}

		public void setIdespac(long idespac) {
			this.idespac = idespac;
		}



}