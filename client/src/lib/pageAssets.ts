import prfEditalImage from "@assets/pr_1782187527391.png";

export { prfEditalImage };

export function preloadEditalPage(): void {
  const img = new Image();
  img.src = prfEditalImage;
}
