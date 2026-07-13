import { useQuery } from "@tanstack/react-query";
import faqApi from "./faq.api";

const useFaqsQuery = () => {
  const queryResult = useQuery(["get-faqs"], () => faqApi.getAllFaqs());
  return queryResult;
};

const faqQueries = {
  useFaqsQuery,
};

export default faqQueries;
