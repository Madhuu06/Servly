import { AlertTriangle, X } from 'lucide-react';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-1 hover:bg-red-100 rounded-full transition disabled:opacity-50"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 font-medium">
                                ⚠️ This action cannot be undone!
                            </p>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <p className="font-medium text-gray-900">
                                The following data will be permanently deleted:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Your account and login credentials</li>
                                <li>Your profile information</li>
                                <li>Your service listing on the map</li>
                                <li>All reviews and ratings</li>
                                <li>Service request history</li>
                            </ul>
                        </div>

                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            You will need to create a new account if you want to use Servly again in the future.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Deleting...
                            </>
                        ) : (
                            'Delete Account'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
