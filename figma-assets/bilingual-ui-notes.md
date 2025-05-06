# Bilingual UI Notes

## Best Practices
- All navigation, forms, and key UI elements must support both English and Bengali.
- Use a prominent language toggle in the header (EN | বাংলা).
- Ensure text expansion is handled gracefully (Bengali may require more space).
- Use accessible Bengali fonts: Noto Sans Bengali, SolaimanLipi, or similar.
- Test all screens in both languages for layout and readability.
- Provide translations for all static and dynamic content.
- Use Unicode for Bengali text to ensure compatibility.
- Consider right-to-left (RTL) support if needed for future expansion.

## Implementation Tips
- Store translations in JSON or similar format for easy switching.
- Use i18n libraries (e.g., react-i18next) for React/Framer implementations.
- Allow users to switch languages at any point in their journey.

---

Update this file with additional notes as the design evolves. 