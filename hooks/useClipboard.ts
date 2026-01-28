import * as Clipboard from "expo-clipboard";

/**
 * Custom hook for clipboard operations
 */
export const useClipboard = () => {
  /**
   * Paste content from clipboard
   * @returns The clipboard content as a string
   */
  const pasteFromClipboard = async (): Promise<string> => {
    try {
      const clipboardText = await Clipboard.getStringAsync();
      return clipboardText;
    } catch (error) {
      console.error("Clipboard error:", error);
      return "";
    }
  };

  /**
   * Copy text to clipboard
   * @param text - Text to copy
   */
  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await Clipboard.setStringAsync(text);
    } catch (error) {
      console.error("Clipboard copy error:", error);
    }
  };

  return {
    pasteFromClipboard,
    copyToClipboard,
  };
};
