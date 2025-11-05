import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import '../styles/galery.css';

function GalleryPage() {
  // Başlangıç fotoğrafları - localStorage'dan yüklenecek
  const initialImages = [
    {
      id: 1,
      src: "/images/bjk-stadium.jpg", 
      alt: "Vodafone Park Stadyumu",
      category: "stadyum",
      uploadedBy: "Admin",
      uploadDate: "2025-01-01"
    },
    {
      id: 2,
      src: "/images/team-1.jpg", 
      alt: "Beşiktaş Takım Kadrosu",
      category: "takim",
      uploadedBy: "Admin",
      uploadDate: "2025-01-02"
    },
    {
      id: 3,
      src: "/images/celebration-1.jpg", 
      alt: "Şampiyonluk Kutlaması",
      category: "kutlama",
      uploadedBy: "Admin",
      uploadDate: "2025-01-03"
    },
    {
      id: 4,
      src: "/images/historic-1.jpg", 
      alt: "Tarihi Anlar",
      category: "tarih",
      uploadedBy: "Admin",
      uploadDate: "2025-01-04"
    },
    {
      id: 5,
      src: "/images/legends-1.jpg", 
      alt: "Beşiktaş Efsaneleri",
      category: "efsaneler",
      uploadedBy: "Admin",
      uploadDate: "2025-01-05"
    }
  ];

  // State'ler
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('bjk-gallery-images');
    return saved ? JSON.parse(saved) : initialImages;
  });

  const [categories] = useState([
    "tümü", "stadyum", "takim", "mac", "taraftar", "kutlama", "tarih", "efsaneler", "antrenman"
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState("tümü");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // Upload form state'leri
  const [newImage, setNewImage] = useState({
    file: null,
    alt: '',
    category: 'takim',
    uploadedBy: ''
  });
  
  const fileInputRef = useRef(null);

  // localStorage'a kaydetme fonksiyonu
  const saveToLocalStorage = (newImages) => {
    localStorage.setItem('bjk-gallery-images', JSON.stringify(newImages));
  };

  // Kategori filtreleme fonksiyonu
  const filterImages = () => {
    if (selectedCategory === "tümü") {
      return images;
    } else {
      return images.filter(image => image.category === selectedCategory);
    }
  };

  // Modal'ı açma fonksiyonu
  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  // Modal'ı kapatma fonksiyonu
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  // Upload modal'ı açma/kapatma
  const openUploadModal = () => {
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setNewImage({
      file: null,
      alt: '',
      category: 'takim',
      uploadedBy: ''
    });
  };

  // Dosya seçme fonksiyonu
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewImage(prev => ({ ...prev, file }));
    } else {
      alert('Lütfen geçerli bir resim dosyası seçin!');
    }
  };

  // Fotoğraf yükleme fonksiyonu
  const handleImageUpload = (e) => {
    e.preventDefault();
    
    if (!newImage.file || !newImage.alt || !newImage.uploadedBy) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    // Dosyayı base64'e çevir (gerçek uygulamada server'a yüklersiniz)
    const reader = new FileReader();
    reader.onload = (event) => {
      const newImageData = {
        id: Date.now(),
        src: event.target.result,
        alt: newImage.alt,
        category: newImage.category,
        uploadedBy: newImage.uploadedBy,
        uploadDate: new Date().toISOString().split('T')[0]
      };

      const updatedImages = [newImageData, ...images];
      setImages(updatedImages);
      saveToLocalStorage(updatedImages);
      closeUploadModal();
      
      // Başarı mesajı
      alert('Fotoğraf başarıyla eklendi! 🎉');
    };
    
    reader.readAsDataURL(newImage.file);
  };

  // Fotoğraf silme fonksiyonu
  const deleteImage = (imageId) => {
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      saveToLocalStorage(updatedImages);
      closeModal();
    }
  };

  // Bir sonraki resme geçme
  const nextImage = () => {
    const filteredImages = filterImages();
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  // Bir önceki resme geçme
  const prevImage = () => {
    const filteredImages = filterImages();
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <div className="gallery-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gallery-header"
      >
        <h1>Beşiktaş JK Fotoğraf Galerisi</h1>
        <p>Siyah Beyaz bir hayat için en güzel anları paylaşın!</p>
        
        <motion.button 
          className="upload-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openUploadModal}
        >
          <i className="fas fa-plus"></i>
          Fotoğraf Ekle
        </motion.button>
      </motion.div>

      <div className="filter-container">
        {categories.map((category, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      <div className="gallery-stats">
        <p>Toplam {images.length} fotoğraf • Görüntülenen: {filterImages().length}</p>
      </div>

      <motion.div 
        className="gallery-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {filterImages().map((image) => (
          <motion.div
            key={image.id}
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => openModal(image)}
          >
            <img src={image.src} alt={image.alt} />
            <div className="image-overlay">
              <h3>{image.alt}</h3>
              <div className="image-info">
                <span className="category-badge">{image.category}</span>
                <span className="upload-info">
                  <i className="fas fa-user"></i> {image.uploadedBy}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filterImages().length === 0 && (
        <motion.div 
          className="no-images"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <i className="fas fa-images"></i>
          <h3>Bu kategoride henüz fotoğraf yok</h3>
          <p>İlk fotoğrafı eklemek için yukarıdaki "Fotoğraf Ekle" butonunu kullanın!</p>
        </motion.div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <motion.div
          className="modal-overlay active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeUploadModal}
        >
          <motion.div
            className="upload-modal"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="upload-header">
              <h2>Yeni Fotoğraf Ekle</h2>
              <button className="close-btn" onClick={closeUploadModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleImageUpload} className="upload-form">
              <div className="file-upload-area" onClick={() => fileInputRef.current.click()}>
                {newImage.file ? (
                  <div className="file-preview">
                    <img src={URL.createObjectURL(newImage.file)} alt="Preview" />
                    <p>{newImage.file.name}</p>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Fotoğraf seçmek için tıklayın</p>
                    <span>JPG, PNG, WEBP formatları desteklenir</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="form-group">
                <label>Fotoğraf Açıklaması</label>
                <input
                  type="text"
                  value={newImage.alt}
                  onChange={(e) => setNewImage(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Fotoğrafı açıklayan birkaç kelime..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Kategori</label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.filter(cat => cat !== 'tümü').map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>İsminiz</label>
                <input
                  type="text"
                  value={newImage.uploadedBy}
                  onChange={(e) => setNewImage(prev => ({ ...prev, uploadedBy: e.target.value }))}
                  placeholder="Adınız ve soyadınız..."
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={closeUploadModal} className="btn-cancel">
                  İptal
                </button>
                <button type="submit" className="btn-upload">
                  <i className="fas fa-upload"></i>
                  Fotoğrafı Ekle
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          className={`modal-overlay ${modalOpen ? 'active' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: modalOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeModal}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: modalOpen ? 1 : 0.5, opacity: modalOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <img src={selectedImage.src} alt={selectedImage.alt} />
            
            <div className="modal-caption">
              <h3>{selectedImage.alt}</h3>
              <div className="image-details">
                <span><i className="fas fa-tag"></i> {selectedImage.category}</span>
                <span><i className="fas fa-user"></i> {selectedImage.uploadedBy}</span>
                <span><i className="fas fa-calendar"></i> {selectedImage.uploadDate}</span>
              </div>
              
              {selectedImage.uploadedBy !== 'Admin' && (
                <button 
                  className="delete-btn"
                  onClick={() => deleteImage(selectedImage.id)}
                >
                  <i className="fas fa-trash"></i>
                  Sil
                </button>
              )}
            </div>
            
            <button className="nav-btn prev-btn" onClick={prevImage}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="nav-btn next-btn" onClick={nextImage}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default GalleryPage;