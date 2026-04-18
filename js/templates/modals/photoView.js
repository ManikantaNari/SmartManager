// Photo View Modal Template

export const PhotoViewModalTemplate = `
<div class="modal-overlay" id="photoViewModal" onclick="closePhotoModal()" style="background: rgba(0,0,0,0.9);">
    <div class="modal" onclick="event.stopPropagation()" style="background: transparent; box-shadow: none; max-width: 95vw; max-height: 95vh; padding: 0;">
        <button class="modal-close" onclick="closePhotoModal()" style="position: absolute; top: -40px; right: 0; background: white; color: var(--dark); width: 36px; height: 36px; border-radius: 50%; font-size: 24px;">&times;</button>
        <img id="photoViewImage" src="" alt="Invoice Photo" style="max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px;">
    </div>
</div>
`;
