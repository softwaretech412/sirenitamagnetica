// Simple modal functionality for Tailwind CSS

const Modal = {
    // Show modal
    show: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Add backdrop
            const backdrop = document.createElement('div');
            backdrop.id = 'modalBackdrop';
            backdrop.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
            backdrop.onclick = () => Modal.hide(modalId);
            document.body.appendChild(backdrop);
        }
    },

    // Hide modal
    hide: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        // Remove backdrop
        const backdrop = document.getElementById('modalBackdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
};
