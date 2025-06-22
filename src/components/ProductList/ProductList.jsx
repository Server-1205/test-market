import { Card } from "../Card/Card";

export function ProductList({ products }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {products &&
          products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
      </div>
    </>
  );
}
