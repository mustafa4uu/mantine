import { useEffect } from "react";
import {
  ScrollArea,
  Stack,
  Popover,
  Tooltip,
  Image,
  Text,
  Skeleton,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // ✅ react-router-dom
import type { RootState } from '../../store/store';
import { fetchSideBarData } from "../../store/SideBarSlice";

import databaseIcon from "../../assets/icons/database.svg";
import onboardingIcon from "../../assets/icons/onboarding.svg";
import tagsIcon from "../../assets/icons/tags.svg";

interface SidebarProps {
  setMenuOpened: (key: string | null) => void;
  menuOpened: string | null;
}

const ICONS_MAP = {
  database: databaseIcon,
  onboarding: onboardingIcon,
  tags: tagsIcon,
};

export default function SideBar({ setMenuOpened, menuOpened }: SidebarProps) {
  const dispatch = useDispatch();

  const { sideBarData, loading } = useSelector(
    (state: RootState) => state.sideBarData
  );
  useEffect(() => {
    dispatch<any>(fetchSideBarData());
  }, [dispatch]);

  const handleSubItemClick = () => {
    setMenuOpened(null);
  };

  return (
    <ScrollArea style={{ height: "100%" }}>
      {loading ? (
        <Stack align="center" gap="lg">
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} height={40} width={40} circle />
          ))}
        </Stack>
      ) : (
        <Stack gap="lg" align="center">
          {sideBarData?.map((item: any) => {
            const iconSrc = ICONS_MAP[item.icon as keyof typeof ICONS_MAP];
            return (
              <Popover
                key={item.key}
                opened={menuOpened === item.key}
                onChange={() =>
                  setMenuOpened(menuOpened === item.key ? null : item.key)
                }
                position="right-start"
                withArrow
                shadow="md"
              >
                <Popover.Target>
                  <div
                    onClick={() =>
                      setMenuOpened(menuOpened === item.key ? null : item.key)
                    }
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      width: "fit-content",
                    }}
                  >
                    <Tooltip label={item.tooltip} position="right" withArrow>
                      {item.icon && iconSrc ? (
                        <Text color="orange">
                          <Image src={iconSrc} alt={item.label} height={25} />
                        </Text>
                      ) : null}
                    </Tooltip>
                    <Text fz={10} ta="center" color="gray">
                      {item.label}
                    </Text>
                  </div>
                </Popover.Target>

                {item?.subItem ? (
                  <Popover.Dropdown>
                    <Stack gap="md">
                      {item.subItem.map((sub: any, idx: number) => (
                        <Text
                          key={idx}
                          size="sm"
                          p={8}
                          color="gray"
                          bg="#f8f8f9"
                          style={{
                            borderRadius: "10px",
                            cursor: "pointer",
                          }}
                          onClick={handleSubItemClick}
                        >
                          <Link
                            to={sub.suburl} // ✅ react-router-dom route
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {sub.label}
                          </Link>
                        </Text>
                      ))}
                    </Stack>
                  </Popover.Dropdown>
                ) : item.mainurl ? (
                  <Popover.Dropdown>
                    <Stack>
                      <Text
                        size="sm"
                        p={8}
                        color="gray"
                        bg="#f8f8f9"
                        style={{
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                        onClick={handleSubItemClick}
                      >
                        <Link
                          to={item.mainurl} // ✅ react-router-dom route
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          Go to {item.label}
                        </Link>
                      </Text>
                    </Stack>
                  </Popover.Dropdown>
                ) : null}
              </Popover>
            );
          })}
        </Stack>
      )}
    </ScrollArea>
  );
}
