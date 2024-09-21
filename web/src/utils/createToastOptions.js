export default function createToastOptions(
  title,
  status = 'success',
  description = null
) {
  return {
    title,
    description,
    status,
    duration: 5000,
    isClosable: true,
  };
}
