import { Loader } from "lucide-react";

const FormButtons = ({
  onCancel,
  cancelLabel = 'Cancel',
  submitLabel = 'Submit',
  isEdit = false,
  isLoading = false,
}) => (
  <div className="flex justify-end space-x-3">
    {onCancel && (
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-[#1C3333]/30 rounded-md shadow-sm text-sm font-medium text-[#1C3333] bg-white hover:bg-[#F4F9F9]"
      >
        {cancelLabel}
      </button>
    )}
    <button
      type="submit"
      disabled={isLoading}
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1C3333] hover:bg-[#1C3333]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3333] disabled:opacity-70"
    >
      {isLoading ? (
        <>
          <Loader className="animate-spin mr-2 h-4 w-4 inline" />
          {isEdit ? 'Updating...' : 'Creating...'}
        </>
      ) : isEdit ? (
        `Update ${submitLabel}`
      ) : (
        `Create ${submitLabel}`
      )}
    </button>
  </div>
);

export default FormButtons;