import { multiply } from 'mathjs';

// take a matrix m and a vector v
// take the product Mv and return the argmax of the result


export function top_k(m, v, k) {
    // returns the indices of the top k elements of the product Mv
    // i.e. the indicies with the greatest dot product with v
    const result = multiply(m, v);
    return result.map((x,i) => [x,i]).sort((a, b) => b[0] - a[0]).slice(0, k).map(x => x[1]);
}