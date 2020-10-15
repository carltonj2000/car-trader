import React from "react";
import { Pagination } from "@material-ui/lab";
import { getAsString } from "@components/getAsString";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { PaginationRenderItemParams } from "@material-ui/lab";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

export function CarPagination({ totalPages }: { totalPages: number }) {
  const { query } = useRouter();
  return (
    <Pagination
      page={parseInt(getAsString(query.page) || "1")}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialUiLink}
          query={query}
          item={item}
          {...item}
        />
      )}
    />
  );
}

interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

const MaterialUiLink = React.forwardRef<HTMLAnchorElement, MaterialUiLinkProps>(
  ({ item, query, ...props }, ref) => (
    <Link
      href={{
        pathname: "/cars",
        query: { ...query, page: item.page },
      }}
      shallow
    >
      <a ref={ref} {...props}></a>
    </Link>
  )
);
